import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { EmergencyContact } from '../types';
import { Users, Plus, Phone, Trash2, UserPlus, Shield, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ContactsScreen: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'emergency_contacts'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EmergencyContact[];
      setContacts(contactsData);
    });

    return unsubscribe;
  }, [user]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'emergency_contacts'), {
        userId: user.uid,
        name: newName,
        phone: newPhone,
        relationship: newRelation,
        isPrimary: contacts.length === 0
      });
      setIsAdding(false);
      setNewName('');
      setNewPhone('');
      setNewRelation('');
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'emergency_contacts', id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 pb-24">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Emergency Contacts</h1>
          <p className="text-zinc-500 text-sm">People who will be notified in SOS</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-100 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-dashed border-zinc-300 flex flex-col items-center justify-center text-center">
            <div className="bg-zinc-100 p-4 rounded-full mb-4">
              <UserPlus size={32} className="text-zinc-400" />
            </div>
            <h3 className="font-bold text-zinc-900">No contacts yet</h3>
            <p className="text-zinc-500 text-sm mt-2">Add trusted people to your safety network</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-6 text-red-600 font-bold text-sm uppercase tracking-widest"
            >
              Add First Contact
            </button>
          </div>
        ) : (
          contacts.map((contact, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={contact.id}
              className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${contact.isPrimary ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-400'}`}>
                  {contact.isPrimary ? <Star size={24} fill="currentColor" /> : <Users size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{contact.name}</h4>
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-tighter">{contact.relationship}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(`tel:${contact.phone}`)}
                  className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  <Phone size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-50 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-8" />
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Add Trusted Contact</h2>
              
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Relationship</label>
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-red-500 outline-none appearance-none"
                    required
                  >
                    <option value="">Select Relation</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Partner">Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-red-100 mt-4 active:scale-95 transition-transform"
                >
                  Save Contact
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsScreen;

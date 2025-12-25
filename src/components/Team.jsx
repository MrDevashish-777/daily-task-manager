import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, MoreVertical, Plus } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';

const Team = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(memberList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching team:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    const inviteToast = toast.loading(`Sending invitation to ${inviteEmail}...`);
    try {
      // In a real app, this would send an email or create an invite record
      // For this demo, we'll just create a placeholder user in Firestore
      await addDoc(collection(db, 'users'), {
        email: inviteEmail,
        displayName: inviteEmail.split('@')[0],
        role: 'Viewer',
        createdAt: Date.now(),
        isPlaceholder: true
      });
      
      toast.success(`Invitation sent to ${inviteEmail}`, { id: inviteToast });
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      console.error("Error inviting member:", err);
      toast.error("Failed to send invitation", { id: inviteToast });
    }
  };

  if (loading) return <div className="card">Loading team members...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users size={28} className="text-primary" />
          <div>
            <h1>Team Members</h1>
            <p className="text-secondary">Manage your team and permissions</p>
          </div>
        </div>
        <Motion.button 
          className="btn btn-primary"
          onClick={() => setShowInvite(!showInvite)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
          Invite Member
        </Motion.button>
      </div>

      {showInvite && (
        <Motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ marginBottom: '2rem', border: '1px dashed var(--primary-color)' }}
          onSubmit={handleInvite}
        >
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="email" 
                className="input-field" 
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Send Invite</button>
            </div>
          </div>
        </Motion.form>
      )}

      <div className="team-list">
        {members.map(member => (
          <Motion.div 
            key={member.id}
            className="activity-item" // Reusing styling
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginBottom: '1rem', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.displayName} style={{ width: 40, height: 40, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(member.displayName || member.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 style={{ margin: 0 }}>{member.displayName || member.email?.split('@')[0]} {member.uid === user.uid && '(You)'}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Mail size={12} />
                  {member.email}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`badge ${member.role === 'Owner' ? 'badge-primary' : 'badge-secondary'}`} style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '2rem', 
                background: member.role === 'Owner' ? 'var(--primary-100)' : 'var(--gray-100)',
                color: member.role === 'Owner' ? 'var(--primary-700)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {member.role}
              </span>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <MoreVertical size={16} />
              </button>
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;

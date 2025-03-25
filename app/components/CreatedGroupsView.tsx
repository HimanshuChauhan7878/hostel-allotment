import React from 'react';

const CreatedGroupsView = ({ groups, preferences }) => {
    return (
        <div>
            <h2>Created Groups</h2>
            {groups.map(group => (
                <div key={group.id}>
                    <h3>{group.name}</h3>
                    <p>Preferences: {preferences.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default CreatedGroupsView; 
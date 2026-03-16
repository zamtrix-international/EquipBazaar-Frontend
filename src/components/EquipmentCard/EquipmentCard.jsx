// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './EquipmentCard.css';

// const EquipmentCard = ({ equipment }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="equipment-card" onClick={() => navigate(`/equipment/${equipment.id}`)}>
//       <div className="equipment-image">
//         <img src={equipment.image} alt={equipment.name} />
//         {!equipment.available && (
//           <span className="badge unavailable">Not Available</span>
//         )}
//       </div>
      
//       <div className="equipment-details">
//         <h3>{equipment.name}</h3>
        
//         <div className="rating">
//           {[...Array(5)].map((_, i) => (
//             <span key={i} className={i < equipment.rating ? 'star filled' : 'star'}>★</span>
//           ))}
//           <span className="review-count">({equipment.reviews} reviews)</span>
//         </div>

//         <div className="pricing">
//           <p className="hourly-rate">₹{equipment.hourlyRate}/hour</p>
//           <p className="daily-rate">₹{equipment.dailyRate}/day</p>
//         </div>

//         <div className="vendor-info">
//           <span className="vendor-name">{equipment.vendor}</span>
//           <span className="location">{equipment.location}</span>
//         </div>

//         <button 
//           className={`book-btn ${!equipment.available ? 'disabled' : ''}`}
//           disabled={!equipment.available}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (equipment.available) {
//               navigate(`/customer/book/${equipment.id}`);
//             }
//           }}
//         >
//           {equipment.available ? 'Book Now' : 'Not Available'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EquipmentCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EquipmentCard.css';

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <div className="equipment-card" onClick={() => navigate(`/equipment/${equipment.id}`)}>
      <div className="equipment-image">
        <img src={equipment.image} alt={equipment.name} />
        {!equipment.available && (
          <span className="badge unavailable">Not Available</span>
        )}
      </div>
      
      <div className="equipment-details">
        <h3>{equipment.name}</h3>
        
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < equipment.rating ? 'star filled' : 'star'}>★</span>
          ))}
          <span className="review-count">({equipment.reviews} reviews)</span>
        </div>

        <div className="pricing">
          <p className="hourly-rate">₹{equipment.hourlyRate}/hour</p>
          <p className="daily-rate">₹{equipment.dailyRate}/day</p>
        </div>

        <div className="vendor-info">
          <span className="vendor-name">{equipment.vendor}</span>
          <span className="location">{equipment.location}</span>
        </div>

        <button
          className={`book-btn ${!equipment.available ? 'disabled' : ''}`}
          disabled={!equipment.available}
          onClick={(e) => {
            e.stopPropagation();
            if (equipment.available) {
              navigate(`/equipment/${equipment.id}`);
            }
          }}
        >
          {equipment.available ? 'Book Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;
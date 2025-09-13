import React from "react";

const ProfileImage = ({ image, className }) => {
  return (
    <div className={`profileImage ${className}`}>
      {/* className={`profileImage ${className}`} */}
      <img
        src={image}
        alt=""
        // style={{
        //   width: "100%",
        //   height: "100%",
        //   objectFit: "cover",
        // }}
      />
    </div>
  );
  //   return <div>ProfileImage</div>;
};

export default ProfileImage;

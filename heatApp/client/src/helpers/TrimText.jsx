import React from "react";

const TrimText = ({ item, maxLength }) => {
  return (
    <>
      {item?.length > maxLength ? item?.substring(0, maxLength) + "..." : item}
    </>
  );
  //   return <div>TrimText</div>;
};

export default TrimText;

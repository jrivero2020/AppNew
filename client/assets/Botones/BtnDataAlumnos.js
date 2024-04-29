import { useState } from "react";

function BotonConHover({ render }) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const buttonStyle = {
    backgroundColor: "#efebe9",
    color: "#004D40",
    cursor: "zoom-in",
    transform: isHover ? "scale(1.3)" : "scale(1)",
  };

  return render({ isHover, handleMouseEnter, handleMouseLeave, buttonStyle });
}

export default BotonConHover;

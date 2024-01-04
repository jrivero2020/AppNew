import React from "react";
import MaskedInput from "react-text-mask";

const RutMask = (props) => {
  const { inputRef,...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref? ref.inputElement : null);
      }}
      mask={[/\d/,/\d/,/\d/,".",/\d/,/\d/,/\d/,".",/\d/,/\d/,/\d/,"-",/[kK\d]/,      ]}
      placeholderChar={"_"}
      showMask
    />
  );
};

export default RutMask;


import React from "react";

const CustomArrow = (props) => {
    const { className, style, onClick, icon } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", fontWeight: "1000", background: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1))", padding: "10px", left: "1170px", border: "black" }}
            onClick={onClick}
        >
            {icon}
        </div>
    );
}

export const NextArrow = (props) => <CustomArrow {...props} icon=">" />;
export const PrevArrow = (props) => <CustomArrow {...props} icon="<" />;




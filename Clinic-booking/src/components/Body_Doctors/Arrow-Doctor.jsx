import React from "react";

const Arrow = (props) => {
    const { className, style, onClick, icon } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", fontWeight: "1000", background: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1))", padding: "10px", border: "black" }}
            onClick={onClick}
        >
            {icon}
        </div>
    );
}

export const NextArrow = (props) => <Arrow {...props} icon=">" className="next" />;
export const PrevArrow = (props) => <Arrow {...props} icon="<" className="prev" />;




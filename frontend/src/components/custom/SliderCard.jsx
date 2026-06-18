import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
const SliderCard = ({url,title,subtitle,footer,img,entry}) => {

    return (
        <>
            <Card>
                <div style={{ position: "relative" }}>
                    <div >
                        <CardMedia
                            component={'div'}
                            style={{
                                height: "300px",
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${img})`,
                            }}
                        />
                        <div
                            
                        >
                            { title }
                            { subtitle }
                        </div>
                        <div>
                            {footer}
                        </div>
                    </div>


                </div>
            </Card>
        </>
    )

}

export default SliderCard;
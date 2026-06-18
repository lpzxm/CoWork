import React from "react";
import CardMedia from "@mui/material/CardMedia";

import { ActionLink } from "components/shared";

const SliderMagazineCard = ({url,title,img,width='200'}) => {
    return (
            <div style={{ position: "relative" }} className="flex justify-center">
                <ActionLink href={url} target='_blank'>
                    <CardMedia
                        component={'div'}
                        style={{
                            textAlign:'center',
                            height: "250px",
                            width: width+'px',
                            paddingTop: "2%",
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${img})`,
                        }}
                    />
                    <div className='mt-4'>
                        { title }
                    </div>
                </ActionLink>


            </div>
    )

}

export default SliderMagazineCard;
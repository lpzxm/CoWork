import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

import { ActionLink } from "components/shared";

const SliderGradientCard = ({url,title,subtitle,footer,img}) => {
    return (
        <Card>
            <div style={{ position: "relative" }}>
                <ActionLink href={url} target='_blank'>
                    <CardMedia
                        component={'div'}
                        style={{
                            height: "250px",
                            paddingTop: "2%",
                            backgroundImage: `url(${img})`,
                        }}
                    />
                    <div>
                        {footer}
                    </div>
                </ActionLink>


            </div>
        </Card>
    )

}

export default SliderGradientCard;
import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({
    title,
    cases,
    isCases,
    isRecovered,
    isDeaths,
    active,
    total,
    ...props
}) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && 'infoBox--selected'} ${
                isCases && 'infoBox--cases'
            } ${isRecovered && 'infoBox--recovered'}  ${
                isDeaths && 'infoBox--deaths'
            }`}
        >
            <CardContent>
                {/* Title  */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* Number of cases  */}
                <h2
                    className={`infoBox__cases ${isCases && 'infoBox--cases'} ${
                        isRecovered && 'infoBox--recovered'
                    }  ${isDeaths && 'infoBox--deaths'} `}
                >
                    {cases}
                </h2>
                {/* Total  */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;

import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const caseTypeColors = {
    cases: {
        hex: '#CC1034',
        multiplier: 800,
    },
    recovered: {
        hex: '#7dd71d',
        multiplier: 1200,
    },
    deaths: {
        hex: '#fb4443',
        multiplier: 2000,
    },
};

// for sorting the data
export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a, b) => b.cases - a.cases);
};

// draw circle on the map with interactive tooltips
export const showDataOnMap = (data, caseType = 'cases') =>
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={caseTypeColors[caseType].hex}
            fillColor={caseTypeColors[caseType].hex}
            radius={
                Math.sqrt(country[caseType]) *
                caseTypeColors[caseType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{
                            backgroundImage: `url(${country.countryInfo.flag})`,
                        }}
                    ></div>
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">
                        Cases : {numeral(country.cases).format('0,0')}
                    </div>
                    <div className="info-recovered">
                        Recovered : {numeral(country.recovered).format('0,0')}
                    </div>
                    <div className="info-deaths">
                        Deaths : {numeral(country.deaths).format('0,0')}
                    </div>
                </div>
            </Popup>
        </Circle>
    ));

// make the stats more prettier
export const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format('0,0')}` : '+0';

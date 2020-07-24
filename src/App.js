import React, { useState, useEffect } from 'react';
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './utils';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
    const [countries, setCountries] = useState(['USA', 'UK', 'INDIA']);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setmapCenter] = useState({
        lat: 19.484793,
        lng: 18.964633,
    });
    const [mapZoom, setMapZoom] = useState(2);
    const [mapCountries, setMapCountries] = useState([]);
    const [caseType, setCaseType] = useState('cases');
    // useEffect runs code based on a given condition
    // for the world wide option when first loading
    useEffect(() => {
        // The code inside here will run once when component load and not agin
        // and also change when the variable inside [] changes
        // if it blank it only load once component loads
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    // useEffect runs code based on a given condition
    useEffect(() => {
        // The code inside here will run once when component load and not agin
        // and also change when the variable inside [] changes
        // if it blank it only load once component loads
        const getCountriesData = async () => {
            await fetch(
                'https://disease.sh/v3/covid-19/countries?allowNull=false'
            )
                .then((response) => response.json())
                .then((data) => {
                    const countries = data
                        .filter((country) => country.countryInfo.iso2 !== null)
                        .map((country) => ({
                            name: country.country,
                            value: country.countryInfo.iso2,
                        }));

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                    setCountries(countries);
                });
        };
        getCountriesData();
    }, []);

    // onc country change
    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url =
            countryCode === 'worldwide'
                ? 'https://disease.sh/v3/covid-19/all'
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // set world wide lat and lng ,zoom when no data
                if (countryCode === 'worldwide') {
                    setCountry('worldwide');
                    setCountryInfo(data);
                    setmapCenter({
                        lat: 19.484793,
                        lng: 18.964633,
                    });
                    setMapZoom(2);
                }
                // set world wide lat and lng ,zoom when there is data
                else {
                    setCountry(countryCode);

                    // all of the data from country response
                    setCountryInfo(data);
                    setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
                    setMapZoom(4);
                }
            });
    };

    return (
        <div className="app">
            <div className="app__left">
                {/* Header */}
                <div className="app__header">
                    {/* Title and Select input dropdown field  */}
                    <h1>COVID 19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select
                            variant="outlined"
                            onChange={onCountryChange}
                            value={country}
                        >
                            <MenuItem value="worldwide">World Wide</MenuItem>
                            {/* Loop through all the countries and show a dropdown list of option */}
                            {countries.map((country) => (
                                <MenuItem value={country.value}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Info-boxes  */}
                <div className="app__stats">
                    {/* Info-boxes title="Corona Virus Cases"  */}
                    <InfoBox
                        isCases
                        active={caseType === 'cases'}
                        onClick={(e) => setCaseType('cases')}
                        title="Coronavirus Cases"
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)}
                    />

                    {/* Info-boxes title = " Corona Virus Recovered" */}
                    <InfoBox
                        isRecovered
                        active={caseType === 'recovered'}
                        onClick={(e) => setCaseType('recovered')}
                        title="Recovered"
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}
                    />

                    {/* Info-boxes title ="Corona Virus Deaths"  */}
                    <InfoBox
                        isDeaths
                        active={caseType === 'deaths'}
                        onClick={(e) => setCaseType('deaths')}
                        title="Deaths"
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}
                    />
                </div>

                {/* Map */}
                <Map
                    caseType={caseType}
                    countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>
            <Card className="app__right">
                <CardContent>
                    {/* Tables */}
                    <h3>Live Cases By Country</h3>
                    <Table countries={tableData} />
                    {/* Graph  */}
                    <h3 className="app__graphTitle">
                        {country === 'worldwide'
                            ? `Worldwide | New ${
                                  caseType.charAt(0).toUpperCase() +
                                  caseType.slice(1)
                              }`
                            : `${countryInfo.country} | New ${
                                  caseType.charAt(0).toUpperCase() +
                                  caseType.slice(1)
                              }`}
                    </h3>
                    <LineGraph
                        className="app__graph"
                        casesType={caseType}
                        country={country}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import json_activities from './json/example_activities.json';
import ActivityCard from './ActivityCard';
import MissionCard from './MissionCard';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

function OrganizeActivities() {
    const [missions, setMissions] = useState({
        'Missione 1': { 'start': null }
    });
    const [availActivities, setAvailActivities] = useState(json_activities.map((value, key) => key));

    const handleSubmit = ((e, values, numberAct, numberMission) => {
        e.preventDefault();
        let new_missions = missions;

        values.forEach(value => {
            if (numberAct === 'start') {
                if (value !== 'new_mission')
                    new_missions[numberMission]['start'] = value;
            }
            else {
                if (!new_missions[numberMission][numberAct].includes(value)) {
                    new_missions[numberMission][numberAct].push(value);
                }
            }
            if (value !== 'new_mission') {
                new_missions[numberMission][value] = [];
            }
        });
        setAvailActivities(availActivities.filter(act => !values.includes(act.toString())));
        setMissions(new_missions);
    });

    return (
        <div className="container-fluid">
            {/* <div className="row row-cols-6 mb-4">
                {
                    json_activities.map((value, i) => {
                        return <ActivityCard id={i} storyline={value['storyline']} />
                    })
                }
            </div> */}

            {
                Object.entries(missions).map(([key, value]) => {
                    const parentConst = { 'missionNumber': key, 'mission': value, 'activities': json_activities, 'availActivities': availActivities, 'handleSubmit': handleSubmit }
                    return <MissionCard parentConst={parentConst} />
                })
            }
        </div>
    );
}

export default OrganizeActivities;
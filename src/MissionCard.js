import React, { useState, useEffect } from 'react';

function AnswerSelectForm({ parentConst, numberActivity, answerText, answerNumber, selectAnswer, handleOnChange }) {
    return (
        <li className="list-group-item">
            <h5>{answerText}</h5>
            <select name={`answer_${answerNumber}`} value={selectAnswer} class="custom-select" onChange={(e) => handleOnChange(e, answerNumber)}>
                <option value="new_mission">{numberActivity !== 'start' ? "Nuova missione" : ''}</option>
                {
                    parentConst['availActivities'].map(value => {
                        return <option value={value.toString()}>Attività {value}</option>
                    })
                }
            </select>
        </li>
    );
}

function AnswerListItem({ parentConst, numberActivity, answers }) {
    const [selectAnswers, setSelectAnswers] = useState(answers.map(val => 'new_mission'));

    const handleOnChange = ((e, number) => {
        setSelectAnswers(selectAnswers.map((val, key) => {
            if (key == number)
                return e.target.value;
            else return val;
        }));
    });

    return (
        <form onSubmit={(e) => parentConst['handleSubmit'](e, selectAnswers, numberActivity, parentConst['missionNumber'])}>
            <div className="form-group">
                <ul className="list-group list-group-horizontal">
                    {
                        answers.map((value, key) => {
                            let answerText;
                            if (numberActivity === 'start') {
                                answerText = "Seleziona prima attività";
                            } else {
                                answerText = `Risposta ${key}: ${value['value']}`;
                            }
                            return <AnswerSelectForm parentConst={parentConst} numberActivity={numberActivity} answerText={answerText} answerNumber={key} selectAnswer={selectAnswers[key]} handleOnChange={handleOnChange} />;
                        })
                    }
                </ul>
                <button type="submit" class="btn btn-primary">Procedi</button>
            </div>
        </form>
    );
}

function ActivitiesItem({ parentConst, childrenActivities }) {
    return (
        <ul className="list-group list-group-flush">
            {
                childrenActivities.map(value => {
                    if (value !== "new_mission") {
                        return <ListItem parentConst={parentConst} numberActivity={parseInt(value)} childrenActivities={parentConst['mission'][value]} />
                    }
                })
            }
        </ul>
    );
}

function ListItem({ parentConst, numberActivity, childrenActivities }) {
    const answers = parentConst['activities'][numberActivity]['questions'][0]['answers'];
    return (
        <li className="list-group-item">
            <div className="card">
                <div className="card-header">
                    Attività {numberActivity}
                </div>
                <div className="card-body">
                    {childrenActivities.length ?
                        <ActivitiesItem parentConst={parentConst} childrenActivities={childrenActivities} /> :
                        <AnswerListItem parentConst={parentConst} numberActivity={numberActivity} answers={answers} />}
                </div>
            </div>
        </li>
    );
}

function MissionCard({ parentConst }) {
    const startActivity = parentConst['mission']['start'];
    let element;
    if (startActivity === null) {
        const answerObj = [0];
        element =
            <AnswerListItem parentConst={parentConst} numberActivity={'start'} answers={answerObj} />;
    } else {
        element =
            <ListItem parentConst={parentConst} numberActivity={parseInt(startActivity)} childrenActivities={parentConst['mission'][startActivity]} />;
    }

    return (
        <div className="card">
            <div className="card-header">
                {parentConst['missionNumber']}
            </div>
            <div className="card-body">
                <ul className="list-group list-group-flush">
                    {element}
                </ul>
            </div>
        </div>
    );
}

export default MissionCard;
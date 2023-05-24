import React, { useState, ChangeEvent } from 'react';
import './Home.css';

interface BoardSize {
    x: number;
    y: number;
}

export function Home () {
    const [text, setText] = useState('');
    const [outputText, setOutputText] = useState('');
    const resultArr :String[] = [];
    const maxBoardSizee: BoardSize = { x: 0, y: 0};
    const dangerZones: BoardSize[] = [];

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const calculateCompas = (currentDirection: String, turnSide: String): String => {
        switch (currentDirection) {
            case "N":
                return (turnSide == "L") ? "W" : "E"
            case "W":
                return (turnSide == "L") ? "S" : "N"
            case "S":
                return (turnSide == "L") ? "E" : "W"
            case "E":
                return (turnSide == "L") ? "N" : "S"
            default:
                return "";
        }
    }
    const calculateTheMovement = (startCoords: BoardSize, startDirection: String, movement: String): String => {
        let currentRobotResult = "";

        const movementList : String[] = movement.split("");
        let robotCoords : BoardSize = startCoords;
        let direction: String = startDirection;

        for (let i = 0; i < movementList.length; i++) {
        // movementList.forEach((move: String) => {
            if (movementList[i] == "F") {
                switch (direction) {
                    case "N":
                        robotCoords.y += 1;
                        break;
                    case "W":
                        robotCoords.x -= 1;
                        break;
                    case "S":
                        robotCoords.y -= 1;
                        break;
                    case "E":
                        robotCoords.x += 1;
                }
            } else if(movementList[i] == "L" || movementList[i] == "R") {
                direction = calculateCompas(direction, movementList[i]);
            }

            // check if robot went outside of board:
            if (robotCoords.x < 0 ||
                robotCoords.x > maxBoardSizee.x ||
                robotCoords.y < 0 ||
                robotCoords.y > maxBoardSizee.y
            ) {
                // if robot went out of bounds, then return result with lost rightaways
                currentRobotResult += robotCoords.x + " " + robotCoords.y + " " + direction + " LOST";
                dangerZones.push(robotCoords);
                break;
            }

            // if robot did not go ouf of board, and we reached last step, then save last position
            if (i == movementList.length -1) {
                currentRobotResult += robotCoords.x + " " + robotCoords.y + " " + direction;
            }
        };
        return currentRobotResult;
    };



    const getLines = (text: string) : string[] => {
        return text.split('\n');
    }

    // get maximum board size:
    const lines = getLines(text);
    maxBoardSizee.x = parseInt(lines[0].split(' ')[0]);
    maxBoardSizee.y = parseInt(lines[0].split(' ')[1]);

    // filter out empty rows to avoid confusion
    const filteredLines:String[] = lines.filter((row) => {
        return row != '';
    })

    // removing size of the board from the list since we dont need it anymore:
    filteredLines.shift();

    // get list of robots:
    const robotsList: String[][] = filteredLines.reduce<String[][]>((result:(String[])[], value: String, index: number, array: String[]) => {
        if (index % 2 === 0) {
            // @ts-ignore
            result.push(array.slice(index, index + 2));
        }
        return result;
    }, []);

    console.log("robotsList", robotsList);
    // iterate through robots and get result of each robot's trip:
    robotsList.forEach((robot: String[]) => {
        // getting start coordinates of current robot
        const currentRobotStartCoord: String[] = robot[0].split(" ");
        const coord: BoardSize = { x: 0, y: 0};
        // @ts-ignore
        coord.x = parseInt(currentRobotStartCoord[0]);
        // @ts-ignore
        coord.y = parseInt(currentRobotStartCoord[1]);

        // getting starting position of current robot:
        const startDirection: String = currentRobotStartCoord[2];

        // getting movement path commands of current robot:
        const movementCommands: String = robot[1];

        const resultForCurrentRobot: String = calculateTheMovement(coord, startDirection, movementCommands);
        resultArr.push(resultForCurrentRobot);
    })

    return (
        <div className={"Home"}>
            <h1>Martian Robot</h1>

            <label htmlFor="multiline-input">Robots input commands: </label>
            <textarea
                id="multiline-input"
                value={text}
                onChange={handleInputChange}
                rows={9}
                cols={40}
            />
            <ul>
                {resultArr.map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
        </div>
    )
}

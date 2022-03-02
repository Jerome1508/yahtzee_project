import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Col, Grid } from "react-native-easy-grid";
import styles from '../style/style';

let board = [];
const N_THROWS = 3;
const N_DICES = 5;

const SPOTS = [
    { value: 1, icon: 'numeric-1-circle' },
    { value: 2, icon: 'numeric-2-circle' },
    { value: 3, icon: 'numeric-3-circle' },
    { value: 4, icon: 'numeric-4-circle' },
    { value: 5, icon: 'numeric-5-circle' },
    { value: 6, icon: 'numeric-6-circle' }
];


export default function Gameboard() {
    
    const [nbrOfThrowsLeft, setnbrOfThrowsLeft] = useState(N_THROWS); 
    const [points, setPoints] = useState(new Array(SPOTS.length).fill(0));
    const [bonusStatus, setBonusStatus] = useState('You are  63 points away from bonus'); 
    const [totalPoints, setTotalPoints] = useState(0);
    const [status, setStatus] = useState('Throw dices.'); 
    const [diceValues, setDiceValues] = useState([]); 
    const [selectedDices, setSelectedDices] =
        useState(new Array(N_DICES).fill(false)); 
    const [selectedPoints, setSelectedPoints] =
        useState(new Array(SPOTS.length).fill(false)); 
     

    
    useEffect(() => {
        
        checkBonusPoints();
    }, [nbrOfThrowsLeft]);

     
    function throwDices() {
        
        if (selectedPoints.every(x => x === true)) {
            startOver();
            return;
        }
        
        if (nbrOfThrowsLeft === 0) {
            setStatus('You have to select your points before doing your next throw.');
            return;
        }
        
        let dices = [...diceValues];
        
        let throws = nbrOfThrowsLeft - 1;
        
        for (let i = 0; i < N_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                dices[i] = randomNumber;
            }
        }
        
        setnbrOfThrowsLeft(throws);
        setDiceValues(dices);
    }

    
    function selectDice(i) {
        let dices = [...selectedDices];
        
        for (let x = 0; x < diceValues.length; x++) {
            if (diceValues[i] === diceValues[x]) {
                dices[x] = selectedDices[i] ? false : true;
            }
        }
        
        setSelectedDices(dices);
    }

    
    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }

    
    function selectPoints(i) {
        let selected = [...selectedPoints];
        selected[i] = true;
        setSelectedPoints(selected);
        calculateSpotCountPoints(i);
        setStatus('Throw dices.');
        setSelectedDices(new Array(N_DICES).fill(false));
        setnbrOfThrowsLeft(N_THROWS);
    }

    
    function calculateSpotCountPoints(i) {
        let sum = 0;
        for (let x = 0; x < diceValues.length; x++) {
            if (diceValues[x] === SPOTS[i].value) {
                sum = sum + diceValues[x];
            }
        }
        let array = [...points];
        array[i] = sum;
        setPoints(array);
        calculateTotalPoints(array);
    }

    function calculateTotalPoints(arr) {
        let sum = arr.reduce((a, b) => a + b, 0);
        setTotalPoints(sum);
    }

    function checkBonusPoints() {
        if (!selectedPoints.every(x => x === true) && totalPoints < 63) {
            setBonusStatus('You are ' + (63 - totalPoints) + ' points away from bonus');
        }
        if (!selectedPoints.every(x => x === true) && totalPoints >= 63) {
            setBonusStatus('You got the bonus!');
        }
        if (selectedPoints.every(x => x === true) && totalPoints < 63) {
            setBonusStatus('You were ' + (63 - totalPoints) + ' points away from bonus');
            setStatus('Game over. All points selected.');
        }
        if (selectedPoints.every(x => x === true) && totalPoints >= 63) {
            setBonusStatus('You got the bonus!');
            setStatus('Game over. All points selected.');
        }
    }
    function startOver() {
        setTLeft(N_THROWS);
        setStatus('Throw dices');
        setBonusStatus('You are  63 points away from bonus');
        setTotalPoints(0);
        setSelectedDices(new Array(N_DICES).fill(false));
        setDiceValues([]);
        setSelectedPoints(new Array(SPOTS.length).fill(false));
        setPoints(new Array(SPOTS.length).fill(0));
        board = [];
    }
    const row = [];
    for (let i = 0; i < N_DICES; i++) {
        row.push(
            <Pressable
                key={'row' + i}
                onPress={() => selectDice(i)}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={'dice' + i}
                    size={60}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }
    const points_row = [];
    for (let i = 0; i < SPOTS.length; i++) {
        points_row.push(
            <View key={'points_row' + i} style={styles.other}>
                <Text>{points[i]}</Text>
                <Grid style={styles.grid}>
                    <Col size={80}>
                        <Pressable
                            key={'row' + i}
                            onPress={() => selectPoints(i)}>
                            <MaterialCommunityIcons
                                name={SPOTS[i].icon}
                                size={55}
                                key={"point" + i}
                                >
                            </MaterialCommunityIcons>
                        </Pressable>
                    </Col>
                </Grid>
            </View>
        )
    }

    return (
        <View style={styles.game}>
            <ScrollView>
                <View style={styles.flex}><Text>{row}</Text></View>
                <Text style={styles.information}>Throws left: {!selectedPoints.every(x => x === true) ? nbrOfThrowsLeft : 0}</Text>
                <Text style={styles.information}>{status}</Text>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button}
                        onPress={() => throwDices()}>
                        <Text style={styles.buttonText}>
                            {selectedPoints.every(x => x === true) ? 'Start Over' : 'Throw dices'}
                        </Text>
                    </Pressable>
                </View>
                <Text style={styles.totalPoints}>Total: {totalPoints}</Text>
                <Text style={styles.information}>{bonusStatus}</Text>
                <View style={styles.flex}>
                    <Text style={styles.pointsRow}>{points_row}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

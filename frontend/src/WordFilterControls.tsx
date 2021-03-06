import React, { useState } from "react";

interface wordFilterControlsProps {
    symbolsToFilter: String[]
    setSymbolsToFilter: any
}

type Props = wordFilterControlsProps;

const WordFilterControls: React.FC<Props> = ({ symbolsToFilter, setSymbolsToFilter }) => {

    const [symbolsToFilterUpdate, setSymbolsToFilterUpdate] = useState<string>('');

    function addSymbolToFilter() {
        if (symbolsToFilter !== undefined) {

            let localStorageUpdate: any = [...symbolsToFilter];
            localStorageUpdate.push(symbolsToFilterUpdate);
            console.log("adding new symbol to filter");
            setSymbolsToFilter((symbolsToFilter: any) => [...symbolsToFilter, symbolsToFilterUpdate]);
            setSymbolsToFilterUpdate("");

            localStorage.setItem("tickers_to_filter", JSON.stringify(localStorageUpdate));
        } else {
            console.log("symbols to filter is undefined");
        }

    }

    function printFilteredWords() {
        if (symbolsToFilter !== undefined) {
            let size = symbolsToFilter.length;
            let string = "";
            for (let i = 0; i < size; i++) {
                string += symbolsToFilter[i] + ", "
            }
            return string;
        } else {
            return "symbol list not loaded";
        }
    }

    function updateSymbolsToFilterUpdate(event: any) {
        setSymbolsToFilterUpdate(event.target.value)
    }

    function removeSymbolFromFilter() {
        setSymbolsToFilter(symbolsToFilter.filter(item => item !== symbolsToFilterUpdate));
        let localStorageUpdate: any = symbolsToFilter.filter(item => item !== symbolsToFilterUpdate)
        localStorage.setItem("tickers_to_filter", JSON.stringify(localStorageUpdate));

        setSymbolsToFilterUpdate("");
    }

    return (
        <div className="wordFilterControls">
            <p>Filtering Words: {printFilteredWords()}</p>
            <input type="text" className="textInput" value={symbolsToFilterUpdate} onChange={updateSymbolsToFilterUpdate} />
            <input type="button" className="subButton" onClick={addSymbolToFilter} value="Add" />
            <input type="button" className="subButton" onClick={removeSymbolFromFilter} value="Remove"></input>
        </div>


    )
}


export default WordFilterControls;
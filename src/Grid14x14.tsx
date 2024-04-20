import React, { useEffect, useState } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

interface CellProps {
  index: number;
  randomNumbers: number[];
  onClick: boolean;
  onChosenCell?: (index: number, color: string) => void;
}

const Cell: React.FC<CellProps> = ({
  index,
  randomNumbers,
  onClick,
  onChosenCell,
}) => {
  const [backGroundColor, setBackGroundColor] = useState<string>("white");

  useEffect(() => {
    setBackGroundColor(randomNumbers.includes(index) ? "#F3D0D7" : "white");
  }, [randomNumbers, index]);

  const handleClick = () => {
    if (onClick) {
      const newColor = backGroundColor === "white" ? "#F3D0D7" : "white";
      setBackGroundColor(newColor);
      if (onChosenCell) {
        onChosenCell(index, newColor);
      }
    }
  };

  return (
    <div onClick={handleClick}>
      <Paper
        sx={{
          height: 50,
          width: 50,
          border: "1px solid #ccc",
          backgroundColor: backGroundColor,
        }}
      >
        {index}
      </Paper>
    </div>
  );
};

const Grid14x14: React.FC = () => {
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [playingNumbers, setPlayingNumbers] = useState<number[]>([]);
  const [result, setResult] = useState<string>("0 / 50");
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const createRandomGrid = () => {
    const gridItems = [];
    for (let row = 0; row < 8; row++) {
      const rowItems = [];
      for (let col = 0; col < 14; col++) {
        const index = row * 14 + col;
        rowItems.push(
          <Grid item key={index}>
            <Cell index={index} randomNumbers={randomNumbers} onClick={false} />
          </Grid>
        );
      }
      gridItems.push(
        <Grid container item key={row}>
          {rowItems}
        </Grid>
      );
    }
    return gridItems;
  };

  const createPlayingGrid = (
    onChosenCell: (index: number, color: string) => void
  ) => {
    const gridItems = [];
    for (let row = 0; row < 8; row++) {
      const rowItems = [];
      for (let col = 0; col < 14; col++) {
        const index = row * 14 + col;
        rowItems.push(
          <Grid item key={index}>
            <Cell
              index={index}
              randomNumbers={playingNumbers}
              onClick={true}
              onChosenCell={onChosenCell}
            />
          </Grid>
        );
      }
      gridItems.push(
        <Grid container item key={row}>
          {rowItems}
        </Grid>
      );
    }
    return gridItems;
  };
  const generateRandomNumbers = () => {
    const min = 0;
    const max = 111;
    const count = 50;
    const randomNumbers: Set<number> = new Set();

    while (randomNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      randomNumbers.add(randomNumber);
    }

    setRandomNumbers(Array.from(randomNumbers));
    setPlayingNumbers([]);
    setResult("0 / 50");
  };

  const onChosenCell = (index: number, color: string) => {
    if (color === "#F3D0D7") {
      setPlayingNumbers((prev) => [...prev, index]);
    } else {
      setPlayingNumbers((prev) => prev.filter((item) => item !== index));
    }
  };

  const generateResult = () => {
    setShowGrid(true);
    const countSameNumbers = (arr1: number[], arr2: number[]) => {
      return arr2.reduce(
        (count, item) => count + (arr1.includes(item) ? 1 : 0),
        0
      );
    };

    const sameNumbers = countSameNumbers(randomNumbers, playingNumbers);
    setResult(`${sameNumbers} / 50`);
  };

  const hideGrid = () => {
    setShowGrid(false);
  };

  return (
    <div>
      <Typography
        sx={{
          fontSize: "24px",
          textAlign: "right",
          margin: "50px 100px 0 0",
        }}
      >
        {playingNumbers.length} chosen cells
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "10px 0 50px 50px",
        }}
      >
        {showGrid ? (
          <Grid container>{createRandomGrid()}</Grid>
        ) : (
          <Grid container> </Grid>
        )}
        <Grid container>{createPlayingGrid(onChosenCell)}</Grid>
      </div>
      <Stack spacing={2} direction="row" sx={{ marginLeft: "50px" }}>
        <Button
          variant="contained"
          color="info"
          onClick={generateRandomNumbers}
        >
          Generate new grid
        </Button>
        <Button variant="contained" color="warning" onClick={hideGrid}>
          Start Playing
        </Button>
        <Button variant="contained" color="success" onClick={generateResult}>
          Show Answer
        </Button>
      </Stack>
      <Typography sx={{ fontSize: "48px" }}>{result}</Typography>
    </div>
  );
};

export default Grid14x14;

import React from 'react';
import {CircularProgress, Card, CardBody, CardFooter, Chip} from "@nextui-org/react";
import './ProgressMeter.css';

const ProgressMeter = ({ value = 70, label = "2800 Data points" }) => {
  return (
    <div className="progress-meter-container">
      <Card className="progress-meter-card w-[240px] h-[240px] border-none bg-gradient-to-br from-[#6093cf] to-[#aed948]">
        <CardBody className="justify-center items-center pb-0">
          <CircularProgress
            classNames={{
              svg: "w-36 h-36 drop-shadow-md",
              indicator: "stroke-white",
              track: "stroke-white/10",
              value: "text-3xl font-semibold text-white",
            }}
            value={value}
            strokeWidth={4}
            showValueLabel={true}
          />
        </CardBody>
        <CardFooter className="justify-center items-center pt-0">
          <Chip
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
          >
            {label}
          </Chip>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProgressMeter;
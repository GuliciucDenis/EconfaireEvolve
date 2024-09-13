import React, { useState, useEffect } from 'react';
import { CircularProgress, Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import './ProgressMeter.css';

import { getAverageObjectiveGradeByUserId } from '../../services/objectiveService';
import { getUser } from '../../services/userService';

const ProgressMeter = ({ label = "Performance percentage" }) => {
  const [averageGrade, setAverageGrade] = useState(null); // Start with null to differentiate between loading state and actual 0 value

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        const grade = await getAverageObjectiveGradeByUserId(user.id);

        // În mulțirea cu 10 se face aici și verificarea de NaN
        const calculatedGrade = grade * 10;
        if (isNaN(calculatedGrade)) {
          setAverageGrade(0); // Setăm la 0 dacă valoarea este NaN
        } else {
          setAverageGrade(calculatedGrade);
        }
        console.log(calculatedGrade);
      } catch (error) {
        console.error("Failed to fetch average grade:", error);
        setAverageGrade(0); // Optionally set to 0 in case of error
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="progress-meter-container">
      <Card className="progress-meter-card w-[240px] h-[240px] border-none bg-gradient-to-br from-[#6093cf] to-[#aed948]">
        <CardBody className="justify-center items-center pb-0">
          {averageGrade !== null ? ( // Check if averageGrade is loaded
            <CircularProgress
              classNames={{
                svg: "w-36 h-36 drop-shadow-md",
                indicator: "stroke-white",
                track: "stroke-white/10",
                value: "text-3xl font-semibold text-white",
              }}
              value={averageGrade}
              strokeWidth={4}
              showValueLabel={true}
            />
          ) : (
            <div>Loading...</div> // Show loading text or spinner while fetching
          )}
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

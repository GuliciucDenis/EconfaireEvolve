import React, { useState, useEffect } from 'react';
import { CircularProgress, Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import './ProgressMeter.css';

import { getAverageObjectiveGradeByUserId } from '../../services/objectiveService';
import { getUser } from '../../services/userService';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/language-selector';

const ProgressMeter = ({ label = "Performance percentage" }) => {
  const [averageGrade, setAverageGrade] = useState(null); // Start with null to differentiate between loading state and actual 0 value
  const {t}=useTranslation();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        const grade = await getAverageObjectiveGradeByUserId(user.id);

        // Multiply by 10 and handle NaN values
        const calculatedGrade = grade * 10;
        if (isNaN(calculatedGrade)) {
          setAverageGrade(0); // Set to 0 if the value is NaN
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
              aria-label={`Performance percentage: ${averageGrade}%`} // Added aria-label for accessibility
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
            aria-label={label} // Optional: enhance accessibility by providing an aria-label
          >
            {label}
          </Chip>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProgressMeter;

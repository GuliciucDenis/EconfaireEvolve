import React, { useState, useEffect } from "react";
import "./FilterPopup.css";
import { useTranslation } from "react-i18next";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import i18n from "../../../i18n";

const FilterPopup = ({ isOpen, onClose, onFilter }) => {
  const {t}=useTranslation();
  const [filterType, setFilterType] = useState("Objective Title");
  const [objectiveTitle, setObjectiveTitle] = useState("");
  const [numObjectives, setNumObjectives] = useState("");
  const [numFilterType, setNumFilterType] = useState("exact");
  const [deadline, setDeadline] = useState("");
  const [sortNameOrder, setSortNameOrder] = useState("asc");
  const [deadlineFilterType, setDeadlineFilterType] = useState("set");

  // Resetarea valorilor când popup-ul este deschis
  useEffect(() => {
    if (isOpen) {
      setFilterType("Objective Title");
      setObjectiveTitle("");
      setNumObjectives("");
      setNumFilterType("exact");
      setDeadline("");
      setSortNameOrder("asc");
      setDeadlineFilterType("set");
    }
  }, [isOpen]);

  const handleFilter = () => {
    const filterCriteria = {
      filterType,
      objectiveTitle,
      numObjectives,
      numFilterType,
      deadline,
      sortNameOrder,
      deadlineFilterType,
    };
  
    console.log(filterCriteria);  // Verificăm valorile filtrului
    onFilter(filterCriteria);      // Transmitem criteriile de filtrare
    onClose();
  };  

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h3>{t('filterPopup.filterBy')}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="popup-body">
          {/* Dropdown pentru alegerea tipului de filtrare */}
          <div className="popup-field">
            <label htmlFor="filterType" style={{ marginBottom: "10px", display: "block" }}>{t('filterPopup.chooseFilter')}</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: "8px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
            >
              <option value="Objective Title">{t('filterPopup.objectiveTitle')}</option>
              <option value="Number of Objectives">{t('filterPopup.nrOfObjectives')}</option>
              <option value="Deadline">{t('filterPopup.deadline')}</option>
              <option value="Sort by Name">{t('filterPopup.sortByName')}</option>
            </select>
          </div>

          {/* Afișare dinamică pe baza filtrului selectat */}
          {filterType === "Objective Title" && (
            <div className="popup-field">
              <label>{t('filterPopup.objectiveTitle')}:</label>
              <input
                type="text"
                value={objectiveTitle}
                onChange={(e) => setObjectiveTitle(e.target.value)}
                placeholder={t('filterPopup.enterTitle')}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>
          )}

          {filterType === "Number of Objectives" && (
            <div className="popup-field">
              <label>{t('filterPopup.filterBynrOfObjectives')}</label>
              <div style={{ marginTop: "10px" }}>
                <label>
                  <input
                    type="radio"
                    value="exact"
                    checked={numFilterType === "exact"}
                    onChange={() => setNumFilterType("exact")}
                  />
                  {t('filterPopup.exact')}
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="ascending"
                    checked={numFilterType === "ascending"}
                    onChange={() => setNumFilterType("ascending")}
                  />
                  {t('filterPopup.ascending')}
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="descending"
                    checked={numFilterType === "descending"}
                    onChange={() => setNumFilterType("descending")}
                  />
                  {t('filterPopup.descending')}
                </label>
              </div>
              
              {/* Afișează inputul de număr doar dacă este selectată opțiunea "Exact" */}
              {numFilterType === "exact" && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="number"
                    value={numObjectives}
                    onChange={(e) => setNumObjectives(e.target.value)}
                    placeholder={t('filterPopup.enterNumber')}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              )}
            </div>
          )}
          {filterType === "Deadline" && (
            <div className="popup-field">
              <label>{t('filterPopup.deadline')}:</label>
              <select
                value={deadlineFilterType}
                onChange={(e) => setDeadlineFilterType(e.target.value)}
                style={{ padding: "8px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
              >
                <option value="set">{t('filterPopup.setDeadline')}</option>
                <option value="next-day">{t('filterPopup.nextDay')}</option>
                <option value="this-week">{t('filterPopup.thisWeek')}</option>
                <option value="this-month">{t('filterPopup.thisMonth')}</option>
                <option value="next-week">{t('filterPopup.nextWeek')}</option>
                <option value="next-month">{t('filterPopup.nextMonth')}</option>
              </select>

              {deadlineFilterType === "set" && (
                <CustomCalendar 
                  selectedDate={deadline}
                  onChange={(newDate) => setDeadline(newDate)}
                  locale={i18n.language === 'ro' ? 'ro' : 'en'}
                  placeholderText={i18n.language === 'ro' ? 'Selectează o dată' : 'Select a date'}
                  style={{ width: "100%", maxWidth: "350px" }}
                  className="custom-datepicker"
                />
                // <input
                //   type="date"
                //   value={deadline}
                //   onChange={(e) => setDeadline(e.target.value)}
                //   style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "10px" }}
                // />
              )}
            </div>
          )}
          {filterType === "Sort by Name" && (
            <div className="popup-field">
              <label>{t('filterPopup.sortOrder')}</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="asc"
                    checked={sortNameOrder === "asc"}
                    onChange={() => setSortNameOrder("asc")}
                  />
                  {t('filterPopup.ascending')}
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="desc"
                    checked={sortNameOrder === "desc"}
                    onChange={() => setSortNameOrder("desc")}
                  />
                  {t('filterPopup.descending')}
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="popup-footer">
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#ccc", cursor: "pointer" }}>
          {t('filterPopup.cancel')}
          </button>
          <button onClick={handleFilter} style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
          {t('filterPopup.applyFilter')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;

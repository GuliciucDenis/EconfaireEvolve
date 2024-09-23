import React, { useState, useEffect } from "react";
import "./FilterPopup.css";

const FilterPopup = ({ isOpen, onClose, onFilter }) => {
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
          <h3>Filter by</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="popup-body">
          {/* Dropdown pentru alegerea tipului de filtrare */}
          <div className="popup-field">
            <label htmlFor="filterType" style={{ marginBottom: "10px", display: "block" }}>Choose a filter:</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: "8px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
            >
              <option value="Objective Title">Objective Title</option>
              <option value="Number of Objectives">Number of Objectives</option>
              <option value="Deadline">Deadline</option>
              <option value="Sort by Name">Sort by Name</option>
            </select>
          </div>

          {/* Afișare dinamică pe baza filtrului selectat */}
          {filterType === "Objective Title" && (
            <div className="popup-field">
              <label>Objective Title:</label>
              <input
                type="text"
                value={objectiveTitle}
                onChange={(e) => setObjectiveTitle(e.target.value)}
                placeholder="Enter objective title"
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>
          )}

          {filterType === "Number of Objectives" && (
            <div className="popup-field">
              <label>Filter by Number of Objectives:</label>
              <div style={{ marginTop: "10px" }}>
                <label>
                  <input
                    type="radio"
                    value="exact"
                    checked={numFilterType === "exact"}
                    onChange={() => setNumFilterType("exact")}
                  />
                  Exact
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="ascending"
                    checked={numFilterType === "ascending"}
                    onChange={() => setNumFilterType("ascending")}
                  />
                  Ascending
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="descending"
                    checked={numFilterType === "descending"}
                    onChange={() => setNumFilterType("descending")}
                  />
                  Descending
                </label>
              </div>
              
              {/* Afișează inputul de număr doar dacă este selectată opțiunea "Exact" */}
              {numFilterType === "exact" && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="number"
                    value={numObjectives}
                    onChange={(e) => setNumObjectives(e.target.value)}
                    placeholder="Enter number"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              )}
            </div>
          )}
          {filterType === "Deadline" && (
            <div className="popup-field">
              <label>Deadline:</label>
              <select
                value={deadlineFilterType}
                onChange={(e) => setDeadlineFilterType(e.target.value)}
                style={{ padding: "8px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
              >
                <option value="set">Set a deadline</option>
                <option value="next-day">Next day</option>
                <option value="this-week">This week</option>
                <option value="this-month">This month</option>
                <option value="next-week">Next week</option>
                <option value="next-month">Next month</option>
              </select>

              {deadlineFilterType === "set" && (
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "10px" }}
                />
              )}
            </div>
          )}
          {filterType === "Sort by Name" && (
            <div className="popup-field">
              <label>Sort Order:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="asc"
                    checked={sortNameOrder === "asc"}
                    onChange={() => setSortNameOrder("asc")}
                  />
                  Ascending
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="desc"
                    checked={sortNameOrder === "desc"}
                    onChange={() => setSortNameOrder("desc")}
                  />
                  Descending
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="popup-footer">
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#ccc", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleFilter} style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;

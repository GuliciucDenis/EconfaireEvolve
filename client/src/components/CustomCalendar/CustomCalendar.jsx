import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { enUS,ro } from 'date-fns/locale';
import './CustomCalendar.css';
registerLocale('en', enUS);
registerLocale('ro', ro);
const CustomCalendar = ({ selectedDate, onChange, locale, placeholderText}) => {
  const today = new Date();

  return (
    <DatePicker
      selected={selectedDate ? new Date(selectedDate) : null}
      onChange={date => {
        const formattedDate = date.toLocaleDateString('en-CA');
        onChange(formattedDate);
      }}
      dateFormat="dd/MM/yyyy"
      locale={locale}
      placeholderText={placeholderText}
      className="custom-datepicker"
      minDate={today}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      onKeyDown={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    />
  );
};

export default CustomCalendar;

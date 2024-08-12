import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import { ReactComponent as CheckboxLine } from "../../../icons/checkbox-line page-2.svg";
import SelectBox from "devextreme-react/select-box";
import { NumberBox, NumberBoxTypes } from "devextreme-react/number-box";
import axios from "axios";

function ExpirationDateSection({
  scheduledDate,
  handleScheduledDateChange,
  maxAndMinLabel,
  expirationDays,
  handleReminderChange,
  reminderDays,
  reminderOptions,
  handleExpirationChange,
  greminderDays,
  gexpirationDays
}) {
  return (
    <div className="section5">
      <div className="Add-ExpirationDate">Expiration Date</div>
      <div className="cale-sec">
        <div className="calander">
          <span>Calendar</span>
          <span className="star2">*</span>
          <DateBox
            placeholder="Select the date"
            stylingMode="outlined"
            className="custom-textbox4"
            value={scheduledDate}
            onValueChange={(e) => handleScheduledDateChange(e)}
          />
        </div>
        <div className="calander2">
          <span>Calendar</span>
          <span className="star2">*</span>
          <NumberBox
            defaultValue={0}
            min={0}
            max={31}
            className="custom-textbox4"
            showSpinButtons={true}
            inputAttr={maxAndMinLabel}
            // value={expirationDays}
            value={gexpirationDays? gexpirationDays: expirationDays}
            valueChangeEvent="keyup"
            onValueChanged={handleExpirationChange}
          />
        </div>
      </div>
      <div className="Checkboxline-icon">
        <CheckboxLine />
        <span className="checkbox-text">
          Alert 1 day before expiration date
        </span>
      </div>
      <div className="Reminder">Reminder</div>
      <div className="role">
        <SelectBox
          // displayExpr="this"
          className="custom-textbox4"
          stylingMode="outlined"
          placeholder="Select an interval of reminder"
          items={reminderOptions}
          displayExpr={"text"}
          valueExpr={"value"}
          value={reminderDays}
          onValueChange={handleReminderChange}
            // value={greminderDays? greminderDays: reminderDays}
        />
      </div>
    </div>
  );
}

ExpirationDateSection.propTypes = {
  reminderOptions: PropTypes.array.isRequired,
};

export default ExpirationDateSection;

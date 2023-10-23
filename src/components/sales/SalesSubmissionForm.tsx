import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Row from "../utils/Row";

const SalesSubmissionForm: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [sportsbook, setSportsbook] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [saleAmount, setSaleAmount] = useState("");
  const [attachments, setAttachments] = useState<FileList | null>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(event.target.value));
  };

  const handleSportsbookChange = (event: any) => {
    setSportsbook(event.target.value as string);
  };

  const handleCustomerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerName(event.target.value);
  };

  const handleSaleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSaleAmount(event.target.value);
  };

  const handleAttachmentsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setAttachments(event.target.files);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      date,
      sportsbook,
      customerName,
      saleAmount,
      attachments,
    });
  };

  const verticalSpacing = "2em";
  const horizontalSpacing = "2em";

  return (
    <form onSubmit={handleSubmit}>
      <Box
        border="1px solid lightBlue"
        p={3}
        alignItems={"center"}
        flexDirection={"column"}
        display="flex"
      >
        <Box alignItems={"center"} flexDirection={"row"} display="flex">
          <TextField
            id="date"
            label="Date"
            type="date"
            value={date ? date.toISOString().substr(0, 10) : ""}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box width={horizontalSpacing} height={verticalSpacing} />
          <FormControl>
            <InputLabel id="sportsbook-label">Sportsbook</InputLabel>
            <Select
              labelId="sportsbook-label"
              id="sportsbook"
              value={sportsbook}
              onChange={(e) => handleSportsbookChange(e)}
              input={<Input />}
            >
              <MenuItem value="DraftKings">DraftKings</MenuItem>
              <MenuItem value="FanDuel">FanDuel</MenuItem>
              <MenuItem value="BetMGM">BetMGM</MenuItem>
            </Select>
            <FormHelperText>Select a sportsbook</FormHelperText>
          </FormControl>
          <Box width={horizontalSpacing} height={verticalSpacing} />
          <TextField
            id="customer-name"
            label="Customer Name"
            value={customerName}
            onChange={handleCustomerNameChange}
          />

          <Box width={horizontalSpacing} height={verticalSpacing} />
          <TextField
            id="sale-amount"
            label="Sale Amount"
            type="number"
            value={saleAmount}
            onChange={handleSaleAmountChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Box>
        <Box width={horizontalSpacing} height={verticalSpacing} />
        <Box alignItems={"center"} flexDirection={"row"} display="flex">
          <input
            accept="image/*"
            id="attachments"
            multiple
            type="file"
            onChange={handleAttachmentsChange}
          />{" "}
          <Box width={horizontalSpacing} height={verticalSpacing} />
          <label htmlFor="attachments">
            <Button variant="contained" component="span">
              Upload Attachments
            </Button>
          </label>
        </Box>
        <Box width={horizontalSpacing} height={verticalSpacing} />
        <Button fullWidth type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default SalesSubmissionForm;

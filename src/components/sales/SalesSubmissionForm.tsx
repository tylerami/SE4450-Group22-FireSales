import React, { useState } from "react";
import SalesSubmissionTile from "./SalesSubmissionTile";

const SalesSubmissionForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const verticalSpacing = "2em";
  const horizontalSpacing = "2em";

  return (
    <form onSubmit={handleSubmit}>
      {/* <Grid p={10} container spacing={0} bgcolor={"lightgray"}>
        <Grid item xs={12}>
          {" "}
          <Typography
            mb={2}
            variant={"h4"}
            fontWeight={500}
            alignSelf={"start"}
          >
            Submit Sales
          </Typography>
        </Grid>

        <SalesSubmissionTile />
        <SalesSubmissionTile />
        <SalesSubmissionTile />
        <SalesSubmissionTile />
        <Box width={horizontalSpacing} height={verticalSpacing} />
        <Button fullWidth type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Grid> */}
    </form>
  );
};

export default SalesSubmissionForm;

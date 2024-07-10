import { LogEntryResponse } from "@mapistry/take-home-challenge-shared";
import { Modal, ModalContent, StyledForm, Header, ButtonContainer, CloseButton } from './CreateLogEntryModal';

// I added this modal because there is already an existing modal, 
// so I could import the already existing elements to make this work within the timeframe
// TODO: However, if I had more time, I would create a reusable modal component and import 
// TODO: that in both CreateLogEntryModal and EditLogEntryModal
interface EditLogEntryProps {
  handleClose: () => void;
  handleEdit: (logEntry: LogEntryResponse) => void;
  logEntry: LogEntryResponse;
}

export function EditLogEntryModal({
  handleClose,
  handleEdit,
  logEntry
}: EditLogEntryProps) {
  return (
    <Modal>
      <ModalContent>
        <CloseButton type="button" onClick={handleClose}>X</CloseButton>
        <Header>Edit Log Entry</Header>
        <StyledForm onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              logDate: { value: string };
              logValue: { value: string };
            };
            // update the entry with new logDate and logValue
            const updatedLogEntry = {
              ...logEntry,
              logDate: new Date(`${target.logDate.value}T00:00:00`),
              logValue: parseInt(target.logValue.value, 10),
            };
            handleEdit(updatedLogEntry);
          }}>
          <label htmlFor="logDate">
            Date:&nbsp;
            <input type="date" 
            name="logDate" 
            defaultValue={new Date(logEntry.logDate).toISOString().substring(0, 10)}/>
          </label>

          <label htmlFor="logValue">
            Value:&nbsp;
            <input 
            type="text" 
            name="logValue" 
            defaultValue={logEntry.logValue}/>
          </label>
          <ButtonContainer>
            <button type="button" onClick={handleClose}>Cancel</button>
            <button type="submit">Save</button>
          </ButtonContainer>
        </StyledForm>
      </ModalContent>
    </Modal>
  );
}
import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { UserContext } from "components/auth/UserProvider";
import Announcement from "models/Announcement";
import { CompensationGroup } from "models/CompensationGroup";
import { User } from "models/User";
import { DependencyInjection } from "models/utils/DependencyInjection";
import React, { useContext, useEffect, useState } from "react";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import EmailService from "services/interfaces/EmailService";
import { UserService } from "services/interfaces/UserService";

type Props = {
  createAnnouncement: (announcement: Announcement) => void;
  exit: () => void;
};

const AnnouncementBuilder = ({ createAnnouncement, exit }: Props) => {
  const { currentUser } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [loading, setLoading] = useState(false);

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();
  const emailService: EmailService = DependencyInjection.emailService();
  const userService: UserService = DependencyInjection.userService();

  const [compGroups, setCompGroups] = useState<CompensationGroup[]>([]);

  const [selectedCompGroupIds, setSelectedCompGroupIds] = useState<string[]>(
    []
  );

  const allChecked = compGroups.length === selectedCompGroupIds.length;
  const toggleAllChecked = () => {
    if (allChecked) {
      setSelectedCompGroupIds([]);
    } else {
      setSelectedCompGroupIds(compGroups.map((compGroup) => compGroup.id));
    }
  };

  const toggleCompGroup = (compGroup: CompensationGroup) => {
    if (selectedCompGroupIds.includes(compGroup.id)) {
      setSelectedCompGroupIds(
        selectedCompGroupIds.filter((id) => id !== compGroup.id)
      );
    } else {
      setSelectedCompGroupIds([...selectedCompGroupIds, compGroup.id]);
    }
  };

  useEffect(() => {
    const fetchCompGroups = async () => {
      const compGroups = await compGroupService.getAll();
      setCompGroups(compGroups);
    };
    fetchCompGroups();
  }, [compGroupService]);

  const saveAnnouncement = async () => {
    const createdByUid = currentUser?.uid;
    if (!createdByUid) return;

    if (!title.trim() || !body.trim()) {
      setErrorText("Please fill out all fields.");
      return;
    }

    setLoading(true);

    const announcement = new Announcement({
      title,
      body,
      global: allChecked,
      compensationGroupIds: new Set<string>(selectedCompGroupIds),
      createdByUid,
    });

    if (sendEmail) {
      const relevantUsers: User[] = await userService.query({
        compensationGroupIds: selectedCompGroupIds,
      });

      try {
        await emailService.sendEmail({
          recipients: relevantUsers,
          subject: title,
          body: body,
        });
      } catch (error) {
        console.log(error);
        setErrorText("Failed to send email.");
        setLoading(false);
        return;
      }
    }

    await createAnnouncement(announcement);

    setLoading(false);
    exit();
  };

  return (
    <Flex direction={"column"} w="full" gap={8}>
      <Input
        focusBorderColor="#ED7D31"
        variant={"outline"}
        placeholder="Announcement Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Flex gap={4}>
        <Text>Send email blast</Text>
        <Switch
          isChecked={sendEmail}
          onChange={() => setSendEmail(!sendEmail)}
        />
      </Flex>
      <Heading size="sm">Compensation Groups</Heading>
      <Flex gap={4} direction="row" wrap={"wrap"}>
        {[null, ...compGroups].map((compGroup: CompensationGroup | null) =>
          compGroup == null ? (
            <Checkbox
              isChecked={allChecked}
              key={"all"}
              onChange={toggleAllChecked}
            >
              All
            </Checkbox>
          ) : (
            <Checkbox
              isChecked={selectedCompGroupIds.includes(compGroup.id)}
              key={compGroup.id}
              onChange={() => toggleCompGroup(compGroup)}
            >
              {compGroup.id}
            </Checkbox>
          )
        )}
      </Flex>

      <Textarea
        minHeight={"6em"}
        fontSize="sm"
        focusBorderColor="#ED7D31"
        variant={"outline"}
        placeholder="Announcement Body..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></Textarea>
      <Button
        isLoading={loading}
        colorScheme="orange"
        w="full"
        onClick={saveAnnouncement}
      >
        Publish
      </Button>
      {errorText && (
        <Text color="red.500" fontSize="sm">
          {errorText}
        </Text>
      )}
    </Flex>
  );
};

export default AnnouncementBuilder;

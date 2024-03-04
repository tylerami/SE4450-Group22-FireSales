import Announcement from "src/models/Announcement";

interface AnnouncementService {
  getAll(): Promise<Announcement[]>;
  markAsRead(announcement: Announcement, userId: string): Promise<void>;
  create(announcement: Announcement): Promise<void>;
  delete(announcement: Announcement): Promise<void>;
}

export default AnnouncementService;

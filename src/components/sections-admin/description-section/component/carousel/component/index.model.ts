export interface VideoProps {
  src: string;
  setOnPlay: (onPlay: boolean) => void;
  onVideoChange: (newSrc: string) => void;
  isAdmin?: boolean; // ✅ Tambahkan ini
  onEditClick?: () => void;
}

export interface UserDropdownProps{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    image?: string;
    id?: number;
    username?: string;
    email?: string;
    editProfile?: boolean;
    inputReview?: boolean;
    support?: boolean;
    onUserPage?: boolean;
}
export interface UserDropdownProps{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    image?: string;
    username?: string;
    email?: string;
    editProfile?: boolean;
    accountSettings?: boolean;
    support?: boolean;
    onUserPage?: boolean;
}
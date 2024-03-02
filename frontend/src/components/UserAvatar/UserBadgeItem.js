import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

// UserBadgeItem component takes user, handleFunction, and admin as props
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    // Badge component for styling
    <Badge
      px={2} // Padding on the x-axis
      py={1} // Padding on the y-axis
      borderRadius="lg" // Rounded corners
      m={1} // Margin
      mb={2} // Bottom margin
      variant="solid" // Solid variant
      fontSize={12} // Font size
      colorScheme="purple" // Color scheme customization
      cursor="pointer" // Cursor style indicating it's clickable
      onClick={handleFunction} // Attach handleFunction to the onClick event
    >
      {user.name} {/* Display user's name */}
      {admin === user._id && <span> (Admin)</span>}
      {/* Conditionally display "(Admin)" if user is an admin */}
      <CloseIcon pl={1} /> {/* Close icon with left padding */}
    </Badge>
  );
};

export default UserBadgeItem;

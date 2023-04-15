import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {
    Box,
    HStack,
    Center,
    Button,
    ButtonGroup,
    IconButton,
    Heading,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    // useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import WalletConnect from './WalletConnect.jsx';


const CustomButton = ({
    variant = 'ghost',
    hover_bg = 'black',
    hover_color = 'white',
    hover_boxShadow = '2lg',
    ...props
}) => {
    return (
        <Button
            variant={variant}
            _hover={{
                bg: hover_bg,
                color: hover_color,
                boxShadow: hover_boxShadow,
            }}
            {...props}
        />
    );
}

const Header = () => {
    // const { isOpen, onOpen, onClose } = useDisclosure();
    // const {timeId, setTimeId } = useState(null);
    const navigate = useNavigate();

    return (
        <>
            <Box
                w={"100%"}
                h={"60px"}
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={5}
            >
                <HStack>

                    <Heading
                        onClick={() => navigate('/')}
                        _hover={{
                            cursor: 'pointer',
                        }}
                        mx={5}
                    >WaveHackathon
                    </Heading>
                    <HStack>
                        <CustomButton
                            onClick={() => navigate('/hackathons/create')}
                        >
                            Create Hackathon
                        </CustomButton>
                        <CustomButton
                            onClick={() => navigate('/')}
                            isDisabled={true}
                        >
                            Create Product
                        </CustomButton>

                    </HStack>
                </HStack>


                <WalletConnect />
            </Box>
        </>
    );
}

export default Header
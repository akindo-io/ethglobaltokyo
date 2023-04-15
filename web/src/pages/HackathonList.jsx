import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Text,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Center,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Heading,
    VStack,
    HStack,
    Tag,
} from '@chakra-ui/react'
import HackathonCard from '../components/HackathonCard.jsx'
import { useNavigate } from 'react-router-dom';
import HackathonContract from '../ABIs/WaveHackathon.json'
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS, ERC20_SAMPLE_ADDRESS } from '../Config.js'

const USDC_ADDRESS = ERC20_SAMPLE_ADDRESS

const ProductList = () => {

    const [hackathons, setHackathons] = useState([]);
    const [waveCounts, setWaveCounts] = useState({});

    const navigate = useNavigate();


    useEffect(() => {
        getHackathons();
    }, [])

    useEffect(() => {
        async function fetchWaveCounts() {
            const counts = {};
            for (const hackathonId of hackathons) {
                const count = await contract.getWaveCount(hackathonId);
                counts[hackathonId] = count.toNumber();
            }
            setWaveCounts(counts);
        }
        fetchWaveCounts();
    }, [hackathons]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, HackathonContract.abi, signer);

    const getHackathons = async () => {
        const hakachons_ = await contract.getHackathons();
        setHackathons(hakachons_)
    }


    return (
        <>
            <Center>
                <Box
                    w={"600px"}
                >
                    <Heading
                        as={"h1"}
                        my={5}
                        color={"white"}
                    >
                        Hackathons
                    </Heading>
                    <Card
                        w={"500px"}
                    >
                        <CardBody>
                            {hackathons.map((hackathonId) => (
                                <HackathonCard
                                    key={hackathonId}
                                    hackathonId={hackathonId}
                                    waveCount={waveCounts[hackathonId]}
                                />
                            ))
                            }

                            <Center
                                mt={5}
                            >

                                <Button
                                    onClick={() => navigate('/hackathons/create')}
                                >
                                    Create Hackathon
                                </Button>
                            </Center>
                        </CardBody>
                    </Card>
                </Box>
            </Center>

        </>

    )
}

export default ProductList
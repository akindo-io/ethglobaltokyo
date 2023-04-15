import React, { useEffect, useState } from 'react'
import {
    Box,
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
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    HStack,
    VStack,
    Heading,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Tag,
} from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import { ethers } from "ethers";
import HackathonContract from "../ABIs/WaveHackathon.json";

import ProductCard from "../components/ProductCard.jsx";

import { CONTRACT_ADDRESS, ERC20_SAMPLE_ADDRESS } from '../Config.js'


const HackathonDetail = () => {

    const [txnHash, setTxnHash] = useState(null);
    const [miningStatus, setMiningStatus] = useState(null);
    const [submitProductsList, setSubmitProductsList] = useState([]);
    const [waveCount, setWaveCount] = useState(0);

    const location = useLocation();
    // 応急処置, 空白処理なし
    const hackathonId = location.pathname.split("/").pop();
    
    useEffect(()=>{
        getSubmitProducts();
    }, [])

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, HackathonContract.abi, signer);

    useEffect(() => {
        const fetchWaveCount = async () =>{
            const count = await contract.getWaveCount(hackathonId);
            setWaveCount(count.toNumber());
        }
        fetchWaveCount();
    }, []);

    const getSubmitProducts = async () => {
        const hakachons_ = await contract.getSubmitProducts(
            hackathonId, 0
        );
        setSubmitProductsList(hakachons_);        
        
    }


    const submitProduct = async () => {

        try {
            setMiningStatus('mining');

            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, HackathonContract.abi, signer);

                let submit = await contract.submitProduct(
                    hackathonId
                    // { gasLimit: 800000 }
                );
                await submit.wait();

                setTxnHash(submit.hash);
                setMiningStatus('success');
            } else {
                setMiningStatus('error');
            }
        } catch (err) {
            setMiningStatus('error');
            console.log("err");
        }
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
                        Hackathon Detail
                    </Heading>
                    <Card>
                        <CardBody>
                            <Heading>
                                Project: {hackathonId}
                            </Heading>

                            <Tag
                                mt={2}
                                colorScheme='green'
                            >Wave {waveCount}</Tag>

                            <Tabs 
                                mt={5}
                            variant='soft-rounded' colorScheme='blue'>
                                <TabList>
                                    <Tab>Overview</Tab>
                                    <Tab>Award History</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>

                                        <Heading
                                            as={"h1"}
                                            my={5}
                                            size={"md"}
                                        >
                                            Overview
                                        </Heading>

                                        <Text>
                                            The Phoenix Guild and Chingari are collaborating to organize a Aptos Hackathon in partnership with projects in the Aptos ecosystem to create awareness and teach the attendees about their technology. In addition to generic programmings like hackathon brainstorming and ideation workshops, the hack will also have some specific sponsor workshops and panels.
                                        </Text>


                                        <Heading
                                            as={"h1"}
                                            my={5}
                                            size={"md"}
                                        >
                                            Submit Product
                                        </Heading>

                                        <FormControl>
                                            <FormLabel>Submission</FormLabel>
                                            <Input />
                                        </FormControl>

                                        <Center>
                                            <Button
                                                mt={5}
                                                onClick={() => submitProduct()}
                                                isLoading={miningStatus === 'mining'}
                                                loadingText="Submitting"
                                            >
                                                Submit
                                            </Button>
                                        </Center>

                                        <Heading
                                            as={"h1"}
                                            my={5}
                                            size={"md"}
                                        >
                                            Submitted Products
                                        </Heading>

                                        {submitProductsList.map((submittedAddress, index) => (
                                            <ProductCard
                                                key={submittedAddress}
                                                productId={index}
                                                submittedAddress={submittedAddress}
                                            />
                                        ))}

                                        <Center>
                                            <Button
                                                colorScheme={"yellow"}
                                                mt={5}
                                                onClick={() => window.open('https://snapshot.org/')}
                                            >
                                                Judgement
                                            </Button>
                                        </Center>


                                    </TabPanel>
                                    <TabPanel>
                                        <Accordion defaultIndex={[0]} allowMultiple>
                                            {[1, 2, 3].map((pastWave) => (

                                                <AccordionItem
                                                    key={pastWave}
                                                >
                                                    <h2>
                                                        <AccordionButton>
                                                            <Box as="span" flex='1' textAlign='left'>
                                                                Wave {pastWave}
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                    </h2>
                                                    <AccordionPanel pb={4}>                                                        
                                                        Ranking 1: msg.sender : 100 USD: 19
                                                        Ranking 2: msg.sender : 100 USD: 2 
                                                        Ranking 3: msg.sender : 100 USD: 3
                                                    </AccordionPanel>
                                                </AccordionItem>


                                            ))}
                                        </Accordion>

                                    </TabPanel>
                                </TabPanels>
                            </Tabs>


                        </CardBody>
                    </Card>
                </Box>
            </Center>
        </>
    )
}

export default HackathonDetail
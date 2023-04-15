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
    Link
} from '@chakra-ui/react'

import SliderInput from '../components/SliderInput.jsx'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

// ABI
import HackathonContract from '../ABIs/WaveHackathon.json'
import USDCContract from '../ABIs/FiatTokenV2_1.json'

import { CONTRACT_ADDRESS, ERC20_SAMPLE_ADDRESS } from '../Config.js'

const USDC_ADDRESS = ERC20_SAMPLE_ADDRESS

const CreateHackathon = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const navigate = useNavigate()

    const [hackathonId, setHackathonId] = useState(null);
    const [ERC20unit, setERC20Unit] = useState("USDC");
    const [ERC20address, setERC20Address] = useState(USDC_ADDRESS);
    const [waveCount, setWaveCount] = useState(5)
    const [wavesPrize, setWavesPrize] = useState(100);
    const [depositAmount, setDepositAmount] = useState(null);
    const [waveSubmitTime, setWaveSubmitTime] = useState(3);
    const [waveVoteTime, setWaveVoteTime] = useState(100); // 1 day constant


    // Minig
    const [txnHash, setTxnHash] = useState(null);
    const [miningStatus, setMiningStatus] = useState(null);

    const abi = HackathonContract.abi

    console.log(walletAddress)

    console.log(ERC20address, walletAddress, wavesPrize, depositAmount, waveSubmitTime, waveVoteTime, "HelloWorld")

    useEffect(() => {
        setDepositAmount(waveCount * wavesPrize);
    }, [waveCount, wavesPrize])

    useEffect(() => {

        checkWalletIsConnected();
    }, [walletAddress])


    const boxMy = 6

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const network = await ethereum.request({ method: 'eth_chainId' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            setWalletAddress(account);
        }
    }

    const approve = async () => {
        try {
            setMiningStatus('mining');

            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(ERC20address, USDCContract.abi, signer);

                let approve = await contract.approve(CONTRACT_ADDRESS, depositAmount, { gasLimit: 270000 });
                await approve.wait();

                setTxnHash(approve.hash);
                setMiningStatus('success');
            } else {
                setMiningStatus('error');
            }

        } catch (err) {
            setMiningStatus('error');
            console.log("err");
        }
    }

    const isApproved = async () => {
        const allowanceAmount = await allowance();
        if (allowanceAmount >= depositAmount) {
            return true;
        } else {
            return false;
        }
    }

    const allowance = async () => {
        const { ethereum, polygon } = window;
        if (ethereum || polygon) {
            let provider;
            if (ethereum) {
                provider = new ethers.providers.Web3Provider(ethereum);
            } else {
                provider = new ethers.providers.Web3Provider(polygon);
            }
            const signer = provider.getSigner();
            const contract = new ethers.Contract(ERC20address, USDCContract.abi, signer);

            const allowance = await contract.allowance(walletAddress, CONTRACT_ADDRESS);
            return allowance;
        }
    }

    const openHackathon = async () => {
        try {

            if (await isApproved()) {
                console.log("approved")
            } else {
                await approve();
            }

            setMiningStatus('mining');

            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                // const seed = Math.random().toString(36).substring(7) // hackathon name
                const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

                let open = await contract.open(
                    ERC20address,
                    walletAddress,
                    wavesPrize, // 10 wavesPrize
                    depositAmount, // 1000 depositAmount
                    waveSubmitTime, // 10min
                    waveVoteTime, // 10min
                    hackathonId,
                    { gasLimit: 800000 }
                );
                await open.wait();

                setTxnHash(open.hash);
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
                        Create Hackathon
                    </Heading>

                    <Center>
                        <VStack
                            spacing={5}
                        >
                            <Card
                                w={"600px"}
                            >
                                <CardHeader>
                                    {/* <Heading size={"md"}>
                                        2. Create Hackathon
                                    </Heading> */}
                                </CardHeader>
                                <CardBody
                                    pt={0}
                                >

                                    <FormControl>

                                        <Box
                                            mb={boxMy}
                                        >
                                            <FormLabel>Hackathon Name</FormLabel>
                                            <Input
                                                placeholder='Hackathon X'
                                                type='text'
                                                onChange={(e) => setHackathonId(e.target.value)}                                                                                    
                                            >
                                            </Input>
                                        </Box>


                                        <Box
                                            mb={boxMy}
                                        >
                                            <FormLabel>ERC20</FormLabel>
                                            <Select
                                                placeholder='Select ERC20'
                                                onChange={(e) => (
                                                    <>
                                                        setERC20Unit(e.target.value)
                                                        if (e.target.value === 'USDC') {
                                                            setERC20Address(USDC_ADDRESS)
                                                        }
                                                    </>
                                                )
                                                }
                                            >
                                                <option value='USDC'>USDC</option>
                                                {/* <option value='USDT'>USDT</option> */}
                                            </Select>
                                        </Box>

                                        <Box
                                            my={boxMy}
                                        >
                                            <FormLabel>Wave Count</FormLabel>
                                            <SliderInput
                                                setValue={setWaveCount}
                                                value={waveCount}
                                            />
                                        </Box>

                                        <Box
                                            my={boxMy}
                                        >

                                            <FormLabel>Prize/wave</FormLabel>
                                            <NumberInput
                                                defaultValue={100}
                                                // max={500} 
                                                min={100}
                                                onChange={(value) => setWavesPrize(value)}
                                            >
                                                <NumberInputField />
                                            </NumberInput>
                                        </Box>

                                        <Box
                                            my={boxMy}
                                        >
                                            <FormLabel>Deposit Amount</FormLabel>
                                            <HStack>

                                                <Text
                                                    ml={4}
                                                    my={2}
                                                >
                                                    {depositAmount}
                                                </Text>
                                                <Text>
                                                    {ERC20unit} "/10^6"
                                                </Text>

                                            </HStack>

                                        </Box>

                                        <Box
                                            my={boxMy}
                                        >
                                            <FormLabel>SubmitTime</FormLabel>
                                            <Select
                                                placeholder='_waveSubmitTime'
                                                onChange={(e) => setWaveSubmitTime(e.target.value)}
                                            >
                                                <option value='300'>3 days</option>
                                                <option value='700'>7 days</option>
                                                <option value='1400'>14 days</option>
                                                <option value='3000'>30 days</option>
                                            </Select>
                                        </Box>

                                        <Box
                                            my={boxMy}
                                        >
                                            <FormLabel>
                                                Safe Address
                                            </FormLabel>
                                            <Input placeholder='10000'
                                                defaultValue={"0x07865c6E87B9F70255377e024ace6630C1Eaa37F"}
                                            />
                                            <FormHelperText>
                                                If you do not have a Safe Address, you can refer to
                                                {" "}<Link href="https://docs.safe.global/" color="blue.500">
                                                    this document
                                                </Link>{" "}
                                                to create one.
                                            </FormHelperText>

                                        </Box>

                                    </FormControl>

                                    {isApproved() &&
                                        <Center>
                                            <Text
                                                color={"red.500"}
                                            >
                                                Please approve first.
                                            </Text>

                                        </Center>
                                    }

                                    {/* Submitする */}
                                    <Center
                                    >
                                        {miningStatus === 'success' &&
                                            <Button
                                                colorScheme="green"
                                                onClick={() => { navigate(`/hackathons/${hackathonId}`) }}
                                            >
                                                Go to Hackathon
                                            </Button>
                                        }

                                        {miningStatus !== 'success' &&
                                            <Button
                                                onClick={openHackathon}
                                                isLoading={miningStatus === 'mining'}
                                                loadingText="Submitting"
                                            >Submit</Button>
                                        }

                                    </Center>

                                    {miningStatus === 'error' && <Text>Error</Text>}

                                </CardBody>

                            </Card>
                        </VStack>

                    </Center>
                </Box>
            </Center>


        </>
    )
}

export default CreateHackathon
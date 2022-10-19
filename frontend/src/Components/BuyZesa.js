import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,

} from '@chakra-ui/react';

import Zesa from '../images/zesa.png';
import Ecocash from '../images/ecocash.png';
import Onemoney from '../images/onemoney.png';
import loadingGif from '../images/loader1.gif'
import { useState } from 'react';
import axios from 'axios';
import { fomartNumber } from '../util/util';
import Swal from "sweetalert2";







export default function BuyZesa() {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const initialState = {
        payingNumber: "",
        meterNumber: "",
        amount: "",
    };


    const [state, setState] = useState(initialState);

    const handleChange = (evt) => {
        const value = evt.target.value;      // console.log('firing the handle change  function');
        setState({
            ...state,
            [evt.target.name]: value
        });
    }

    const handleSubmit = (e) => {

        // check if the paying number is and econet number or netone number 
        const netone = /^071/;
        const econet = /^078|^077/;
        const telecel = /^073/;

        const zesaUrl = "http://localhost:5500/zesa/buyToken"



        if (econet.test(state.payingNumber)) {


            // make the payment using ecocacash
            axios.post(`${zesaUrl}`,
                {
                    "amount": state.amount,
                    "meterNumber": state.meterNumber,
                    "phoneNumber": fomartNumber(state.payingNumber),
                    "method": 'econet'

                }
            ).then(data => {

                console.log(data)
                if (data.data.message === "Error") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Transaction failed',
                        text: `Failed to purchase zesa token
                        `,

                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Successful',
                        text: `Token paurchase success .. please check your phone for the sms`
                        ,

                    });
                }
                // console.log(data)
            })
        }

        if (netone.test(state.payingNumber)) {


            // make the payment using ecocacash
            axios.post(`${zesaUrl}`,
                {
                    "amount": state.amount,
                    "meterNumber": state.meterNumber,
                    "phoneNumber": fomartNumber(state.payingNumber),
                    'method': 'onemoney'

                }
            ).then(data => {
                console.log(data)
            })
        }


    }




    return (
        <Box position={'relative'}>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm transaction on your mobile device with pin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* <Lorem count={2} /> */}
                        {/* <p>This is the modal body</p> */}
                        <img src={loadingGif} alt="wait until the page loads" />
                    </ModalBody>

                    {/* <img src={"https://assets1.lottiefiles.com/packages/lf20_ltbqacam.json"} /> */}


                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={onClose}>
                            Close
            </Button>
                        <Button onClick={onClose} variant='ghost'>Done</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>

                <Stack spacing={{ base: 10, md: 20 }}>

                    <Flex w={'full'}>

                        {/* put image here */}
                        <img src={Zesa} />

                        {/*                         
    <Illustration
        height={{ sm: '24rem', lg: '28rem' }}
        mt={{ base: 12, sm: 16 }}
    /> */}
                    </Flex>


                </Stack>

                <Stack
                    bg={'gray.50'}
                    rounded={'xl'}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    maxW={{ lg: 'lg' }}>
                    <Stack spacing={4}>
                        <Heading
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                            Buy Zesa Tokens
                <Text
                                as={'span'}
                                bgGradient="linear(to-r, red.400,pink.400)"
                                bgClip="text">
                                !
                </Text>
                        </Heading>
                        {/* put and illustrator here */}
                    </Stack>
                    <Box as={'form'} mt={10}>
                        <Stack spacing={4}>

                            {/* "amount": 5000,
    "meterNumber": "37132567431",
    "phoneNumber" : "263782824073" */}



                            <Input
                                placeholder="Meter Number"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                                onChange={handleChange}
                                value={state.meterNumber}
                                name="meterNumber"
                            />
                            <Input
                                placeholder="Phone Number to pay transaction"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                                onChange={handleChange}
                                value={state.payingNumber}
                                name="payingNumber"
                            />
                            <Input
                                placeholder="Amount minimun.... $500.00"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                                onChange={handleChange}
                                value={state.amount}
                                name="amount"
                            />

                        </Stack>
                        <Button
                            fontFamily={'heading'}
                            mt={8}
                            w={'full'}
                            bgGradient="linear(to-r, green.400,green.300)"
                            color={'white'}
                            _hover={{
                                bgGradient: 'linear(to-r, green.600,green.400)',
                                boxShadow: 'xl',
                            }}
                            onClick={handleSubmit}
                        >


                            {/* <Button >Open Modal</Button> */}

                            Pay on
                            <img src={Ecocash} width={"80px"} />
                            or
                            <img src={Onemoney} />
                        </Button>
                    </Box>
                    form
                </Stack>


            </Container>

        </Box>
    );
}


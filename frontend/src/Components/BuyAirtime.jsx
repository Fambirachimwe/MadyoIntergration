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

} from '@chakra-ui/react';
import Swal from "sweetalert2";

import { Illustration } from './Hero.jsx';
import { Radio, RadioGroup } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { fomartNumber } from '../util/util.js';



export default function BuyAirTime() {

    const initialState = {
        payingNumber: "",
        targetNumber: "",
        amount: "",
        type: "",


    }

    const [state, setState] = useState(initialState);

    const handleRadio = (e) => {
        setState({
            ...state,
            type: e
        })
    }

    const handleChange = (evt) => {
        const value = evt.target.value;      // console.log('firing the handle change  function');


        setState({
            ...state,
            [evt.target.name]: value
        });
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(stat
        const econet = "http://localhost:5500/airtime/econet/buy";
        const netone = "http://localhost:5500/airtime/netone/buy";
        const telecel = "http://localhost:5500/airtime/telecel/buy";

        //  post the data in the 

        // check the airtime type to send the request to 
        // console.log(fomartNumber(state.targetNumber))


        switch (state.type) {
            case "econet":
                axios.post(`${econet}`,
                    {
                        "amount": state.amount,
                        "targetMobile": `263${fomartNumber(state.targetNumber)}`
                    },

                ).then((data) => {
                    // console.log(data.data)
                    if (data.data.message === "Error") {

                        Swal.fire({
                            icon: 'warning',
                            title: 'Error',
                            text: `${data.data.description}`,

                        });
                    } else {

                        // console.log(data)
                        Swal.fire({
                            icon: 'success',
                            title: 'Successful',
                            text: `${data.data.narrative} Airtime credited, New Bal ${data.data.finalBalance}
                            `,

                        });
                    }

                    setState(initialState)  /// reset the state to the initial state

                })

                break;

            case "netone":
                axios.post(`${netone}`,
                    {
                        "amount": state.amount,
                        "targetMobile": `263${fomartNumber(state.targetNumber)}`
                    },

                ).then((data) => {
                    if (data.data.message === "Error") {

                        Swal.fire({
                            icon: 'warning',
                            title: 'Error',
                            text: `${data.data.description}`,

                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Successful',
                            text: `${data.data.narrative} Airtime credited, New Bal ${data.data.finalBalance}
                            `,

                        });
                    }

                    // setState(initialState)
                })

                break;


            case "telecel":
                axios.post(`${telecel}`,
                    {
                        "amount": state.amount,
                        "targetMobile": `263${fomartNumber(state.targetNumber)}`
                    },

                ).then((data) => {
                    if (data.data.message === "Error") {

                        Swal.fire({
                            icon: 'warning',
                            title: 'Error',
                            text: `${data.data.description}`,

                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Successful',
                            text: `${data.data.narrative} Airtime credited, New Bal ${data.data.finalBalance}
                            `,

                        });
                    }

                    // setState(initialState)
                })

                break;

            default:
                break;
        }


    }


    return (
        <Box position={'relative'}>
            <Container

                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>


                    <Flex w={'full'}>
                        <Illustration
                            height={{ sm: '24rem', lg: '28rem' }}
                            mt={{ base: 12, sm: 16 }}
                        />
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
                            Buy Airtime
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

                            <RadioGroup name="type" onChange={handleRadio}
                                value={state.type}
                            >
                                <Stack direction='row'>
                                    <Radio value="econet">Econet</Radio>
                                    <Radio value="telecel">Telecel</Radio>
                                    <Radio value="netone">Netone</Radio>
                                </Stack>
                            </RadioGroup>

                            <Input
                                placeholder="Mobile Number"  // this is the target mobile
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                                name="targetNumber"
                                value={state.targetNumber}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Phone Number to pay transaction"
                                name="payingNumber"
                                value={state.payingNumber}
                                onChange={handleChange}
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                            />
                            <Input
                                placeholder="Amount minimun.... $500.00"
                                bg={'gray.100'}
                                name="amount"
                                value={state.amount}
                                onChange={handleChange}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',

                                }}
                            />

                        </Stack>
                        <Button
                            onClick={handleSubmit}
                            fontFamily={'heading'}
                            mt={8}
                            w={'full'}
                            bgGradient="linear(to-r, green.400,green.300)"
                            color={'white'}
                            _hover={{
                                bgGradient: 'linear(to-r, green.600,green.400)',
                                boxShadow: 'xl',
                            }}>
                            Pay
              </Button>
                    </Box>
            form
          </Stack>
            </Container>

        </Box>
    );
}


import React, { useState } from 'react';

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Flex,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb
  } from '@chakra-ui/react'

const SliderInput = ({
    setValue,
    value
}) => {
    const handleChange = (value) => setValue(value)
  
    return (
      <Flex>
        <NumberInput 
        defaultValue={5}
        min={5} max={10} maxW='100px' mr='2rem' value={value} onChange={handleChange}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Slider
          flex='1'
          focusThumbOnChange={false}
          value={value}
          onChange={handleChange}
          defaultValue={5}
          min={5}
          max={10}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb fontSize='sm' boxSize='32px' children={value} />
        </Slider>
      </Flex>
    )
  }

export default SliderInput;
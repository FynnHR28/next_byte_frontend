import { Span } from 'next/dist/trace'
import {useState} from 'react'



export function Input({ 
        register, name, placeholder, inputStyle, labelStyle, 
        rules, errors, fontStyle, type 
    }:any){
    
    
    return (
        <div className='flex-col' style={fontStyle}>
            <label 
                htmlFor={name}
                className={labelStyle}
                >{name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <br />
            {errors && <p className='text-sm text-red-400 p-2'>{errors}</p>}
            <input 
                {...register(`${name}`, rules)} 
                placeholder={placeholder} 
                className={inputStyle}
                type={type}
            />
        </div>
    ) 
} 
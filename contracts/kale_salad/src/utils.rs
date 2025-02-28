use soroban_sdk::{Env, String};

pub fn u8_to_string(env: &Env, value: u8) -> String {
    if value == 0 {
        return String::from_str(env, &"0");
    }

    let mut num_digits: usize = 0;
    let mut temp: u8 = value.clone();

    while temp != 0 {
        num_digits += 1;
        temp /= 10;
    }

    let mut slice: [u8; 3] = [0u8; 3];
    let mut index = num_digits;
    temp = value.clone();

    while temp != 0 {
        index -= 1;
        slice[index] = 48 + temp % 10;
        temp /= 10;
    }

    return String::from_bytes(&env, &slice[..num_digits]);
}

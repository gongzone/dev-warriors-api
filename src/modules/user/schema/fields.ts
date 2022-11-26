import { z } from 'zod';

export const id = z.number();

export const userId = z
  .string({
    required_error: '사용자 아이디는 필수 값 입니다.',
    invalid_type_error: '사용자 아이디는 string이여야 합니다.'
  })
  .regex(/^[A-Za-z]{1}[A-Za-z0-9]{3,19}$/, {
    message: '사용자 아이디 형식이 올바르지 않습니다.'
  });

export const password = z
  .string({
    required_error: '비밀번호는 필수 값 입니다.',
    invalid_type_error: '비밀번호는 string이여야 합니다.'
  })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/);

export const confirmPassword = z.string({
  required_error: '비밀번호 확인은 필수 값 입니다.',
  invalid_type_error: '비밀번호 확인은 string이여야 합니다.'
});

export const email = z
  .string({
    required_error: '이메일은 필수 값 입니다.',
    invalid_type_error: '이메일은 string이여야 합니다.'
  })
  .email({ message: '이메일 형식이 올바르지 않습니다.' });

export const accessToken = z.string();

export const refreshToken = z.string();

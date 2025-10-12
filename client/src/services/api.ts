import axios from 'axios';
import type { ProfileList, EditProfileRequest } from '../types';

// API Base URL - 환경 변수나 설정에서 관리할 수 있습니다
const API_BASE_URL = '/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 사용자 질의에 대한 응답을 받아옵니다
 * @param query 사용자의 질문
 * @returns 응답 텍스트
 */
export const getAnswer = async (chainId:string, query: string): Promise<string> => {
  try {
    const response = await api.get<string>('/answer', {
      params: { chain_id: chainId, query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    throw new Error('질의에 대한 응답을 받을 수 없습니다.');
  }
};

/**
 * 프로필 정보를 조회합니다
 * @param userId 사용자 ID (기본값: "movingjin")
 * @returns 전체 프로필 데이터
 */
export const getProfile = async (userId: string): Promise<ProfileList> => {
  try {
    const response = await api.get<ProfileList>('/profile', {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('프로필 정보를 불러올 수 없습니다.');
  }
};

/**
 * 프로필 정보를 수정합니다
 * @param request 수정할 프로필 정보
 * @returns 성공 메시지
 */
export const editProfile = async (request: EditProfileRequest): Promise<string> => {
  try {
    const response = await api.post<{ message: string }>('/profile/edit', request);
    return response.data.message;
  } catch (error) {
    console.error('Error editing profile:', error);
    throw new Error('프로필 수정에 실패했습니다.');
  }
};


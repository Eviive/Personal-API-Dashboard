import { request } from "api/client";
import { buildFormData } from "libs/utils/form-data";
import type { DndItem } from "types/dnd";
import type { Skill, SkillCreation } from "types/entities/skill";
import type { Slice } from "types/pagination";

const URL = "skill";

const findAll = async () => {
    const skills = await request<Skill[]>(`/${URL}`, {
        needsAuth: false
    });
    skills.sort((a, b) => a.sort - b.sort);
    return skills;
};

export const SKILLS_DEFAULT_PAGE_SIZE = 24;

const findSlice = async (page?: number, size = SKILLS_DEFAULT_PAGE_SIZE, search?: string) =>
    request<Slice<Skill>>(`/${URL}/slice`, {
        params: {
            page,
            size,
            search
        },
        needsAuth: false
    });

const create = (skill: SkillCreation, file?: File | null) => {
    if (!file) {
        return request<Skill, SkillCreation>(`/${URL}`, {
            method: "POST",
            data: skill
        });
    }

    return request<Skill, FormData>(`/${URL}/with-image`, {
        method: "POST",
        data: buildSkillFormData(skill, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const update = (skill: Skill, file?: File | null) => {
    if (!file) {
        return request<Skill, Skill>(`/${URL}/${skill.id}`, {
            method: "PUT",
            data: skill
        });
    }

    return request<Skill, FormData>(`/${URL}/${skill.id}/with-image`, {
        method: "PUT",
        data: buildSkillFormData(skill, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const sort = (sorts: DndItem[]) => {
    return request<void, DndItem[]>(`/${URL}/sort`, {
        method: "PATCH",
        data: sorts
    });
};

const deleteSkill = (id: number) =>
    request<void>(`/${URL}/${id}`, {
        method: "DELETE"
    });

const buildSkillFormData = (skill: Skill | SkillCreation, file: File) => {
    return buildFormData(
        {
            type: "json",
            name: "skill",
            value: skill
        },
        {
            type: "blob",
            name: "file",
            value: file
        }
    );
};

export const SkillService = {
    findAll,
    findSlice,
    create,
    update,
    sort,
    delete: deleteSkill
};

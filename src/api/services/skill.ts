import { request } from "api/client";
import type { DndItem } from "types/dnd";

import type { Skill, SkillCreation } from "types/entities/skill";

const URL = "skill";

const findById = (id: number) => request<Skill>(`/${URL}/${id}`, { needsAuth: false });

const findAll = async () => {
    const skills = await request<Skill[]>(`/${URL}`, { needsAuth: false });
    skills.sort((a, b) => a.sort - b.sort);
    return skills;
};

const save = (skill: SkillCreation, file?: File | null) => {
    if (!file) {
        return request<Skill, SkillCreation>(`/${URL}`, {
            method: "POST",
            data: skill
        });
    }

    return request<Skill, FormData>(`/${URL}/with-image`, {
        method: "POST",
        data: buildFormData(skill, file),
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
        data: buildFormData(skill, file),
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

const buildFormData = (skill: Skill | SkillCreation, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("skill", new Blob([JSON.stringify(skill)], { type: "application/json" }));
    return formData;
};

export const SkillService = {
    findById,
    findAll,
    save,
    update,
    sort,
    delete: deleteSkill
};

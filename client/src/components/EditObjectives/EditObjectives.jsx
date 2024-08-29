import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditObjectives() {
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/edit-objectives/${userId}`);
  }, [userId, navigate]);

  return null;
}

export default EditObjectives;

"use client"

import { Conversation } from '@prisma/client'
import React from 'react'

interface ConversationListProps{
  initialItems: Conversation[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems
}) => {
  return (
    <div>ConversationList</div>
  )
}

export default ConversationList